export function json200(res, message, data) {
	if (data) {
		return res.status(200).json({
			message,
			data,
			timestamp: Date.now()
		})
	} else {
		return res.status(200).json({
			message,
			timestamp: Date.now()
		})
	}

}
export function json400(res, message) {
	return res.status(400).json({
		message,
		timestamp: Date.now()
	})
}
export function json500(res, debug) {
	return res.status(500).json({
		message: 'Something went wrong',
		debug,
		timestamp: Date.now()
	})
}
export function json409(res, message) {
	return res.status(409).json({
		message,
		timestamp: Date.now()
	})
}
