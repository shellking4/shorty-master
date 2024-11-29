// URL Shortener Route
routerAdd("POST", "/api/shorten", (c) => {
    const utils = require(`${__hooks}/utils.js`)

    // Parse request body
    const requestData = $apis.requestInfo(c).data

    // Validate URL
    if (!requestData.url || !utils.isValidURL(requestData.url)) {
        return c.json(400, { error: "Invalid URL" })
    }

    // Generate short code
    const shortCode = utils.generateShortCode(requestData.url)

    try {
        // Create record in shortened_urls collection
        const record = $app.dao().findCollectionByNameOrId("shortened_urls")
        const newRecord = new Record(record)

        // Set record fields
        newRecord.set("original_url", requestData.url)
        newRecord.set("short_code", shortCode)
        newRecord.set("clicks", 0)

        // Save the record
        $app.dao().save(newRecord)

        // Construct short URL
        let protocol = 'http'
        if (c.request().tls !== null) {
            protocol = 'https'
        }
        const baseURL = `${protocol}://${c.request().host}/`
        const shortURL = baseURL + shortCode

        // Return response
        return c.json(201, {
            original_url: requestData.url,
            short_url: shortURL,
            short_code: shortCode
        })

    } catch (err) {
        console.log(err)
        return c.json(500, { error: "Failed to create short URL" })
    }
}, $apis.requireRecordAuth())

// Redirect Route
routerAdd("GET", "/:code", (c) => {
    const shortCode = c.pathParam("code")

    try {
        // Find record by short code
        const record = $app.dao().findFirstRecordByFilter(
            "shortened_urls",
            "short_code = {:code}",
            { code: shortCode }
        )

        if (!record) {
            console.log("Short URL not found:", shortCode)
            return c.redirect(404, "/404")
        }

        // Increment clicks
        const currentClicks = record.getInt("clicks") || 0
        record.set("clicks", currentClicks + 1)
        $app.dao().saveRecord(record)

        // Redirect to original URL
        return c.redirect(307, record.get("original_url"))
    } catch (err) {
        return c.redirect(404, "/404")
    }
})

// Optional: Hook to log URL shortening events
onRecordAfterCreateRequest((c) => {
    console.log("New URL shortened:", c.record.get("original_url"))
}, "shortened_urls")