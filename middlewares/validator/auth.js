export function onlyAuth() {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            res.setStatus(res.GAGAL);
            res.setMessage("Anda belum login");
            res.go();
        } else {
            next();
        }
    }
}

export function onlyManager() {
    return (req, res, next) => {
        if(!req.user.type === 'manager') {
            res.status(401);
            res.setStatus(res.GAGAL);
            res.setMessage('Akses ditolak');
            res.go();
        } else {
            next();
        }
    }
}