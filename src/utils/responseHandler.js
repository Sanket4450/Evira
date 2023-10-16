const sendResponse = (res, status, data = [], message) => {
    return res.status(status).json({
        type: "success",
        message: message || "OK",
        results: data
    })
}

module.exports = sendResponse
