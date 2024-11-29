// URL Shortener Route
routerAdd("POST", "/api/shorten", (e) => {

    let authRecord = e.auth

    if (!authRecord) {
        return e.json(401, {
            data: {},
            message: "The request requires valid record authorization token.",
            status: 401
        })
    }

    const utils = require(`${__hooks}/utils.js`)

    // Parse request body
    const requestData = e.requestInfo().body
    
    // Validate URL
    if (!requestData.url || !utils.isValidURL(requestData.url)) {
        return e.json(400, { error: "Invalid URL" })
    }

    // Generate short code
    const shortCode = utils.generateShortCode(requestData.url)

    try {
        // Create record in shortened_urls collection
        const record = $app.findCollectionByNameOrId("shortened_urls")
        const newRecord = new Record(record)
        
        // Set record fields
        newRecord.set("original_url", requestData.url)
        newRecord.set("short_code", shortCode)
        newRecord.set("clicks", 0)

        // Save the record
        $app.save(newRecord)
        

        // Construct short URL
        let protocol = 'http'
        if (e.request.tls !== null) {
            protocol = 'https'
        }
        const baseURL = `${protocol}://${e.request.host}/`
        const shortURL = baseURL + shortCode

        // Return response
        return e.json(201, {
            original_url: requestData.url,
            short_url: shortURL,
            short_code: shortCode
        })
    } catch (err) {
        console.log(err)
        return e.json(500, { error: "Failed to create short URL" })
    }
})

// Redirect Route
routerAdd("GET", "/{code}", (e) => {
    const shortCode = e.request.pathValue("code")

    try {
        // Find record by short code
        const record = $app.findFirstRecordByFilter(
            "shortened_urls", 
            "short_code = {:code}",
            { code: shortCode }
        )

        if (!record) {
            return e.redirect(404, "/404")
        }

        // Increment clicks
        const currentClicks = record.getInt("clicks") || 0
        record.set("clicks", currentClicks + 1)
        $app.save(record)

        // Redirect to original URL
        e.response.header().set("Location", record.get("original_url"))
        return e.json(302)
    } catch (err) {
        return e.redirect(404, "/404")
    }
})

// Optional: Hook to log URL shortening events
onRecordAfterCreateSuccess((e) => {
    console.log("New URL shortened:", e.record.get("original_url"))
    e.next()
}, "shortened_urls")