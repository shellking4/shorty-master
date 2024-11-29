module.exports = {
    generateShortCode: () => {
        const timestamp = new Date().getTime().toString(36)
        const randomPart = Math.random().toString(36).substring(2, 7)
        return (timestamp + randomPart)
            .replace(/[+/]/g, '-')
            .substring(0, 25)
    },
    isValidURL: (str) => {
        // Regex to match URLs starting with http:// or https://
        const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
        return urlPattern.test(str)
    }
}