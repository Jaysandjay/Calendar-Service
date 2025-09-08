
const notFound = (req, res, next) => {
    const err : any = new Error('Not Found')
    err.status = 404
    next(err)
}

export default notFound