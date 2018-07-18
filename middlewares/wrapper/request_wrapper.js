export function a(handler) {
    return (req, res, next) => {
        Promise.resolve(handler(req, res, next)).catch((err) => {
            res.setStatus(res.GAGAL);
            res.setMessage(err);
            res.go();
        })
    }
}