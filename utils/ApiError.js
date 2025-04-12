export class ApiError{
    constructor(
        message="Something went wrong",
        statusCode,
    ){
        this.message = message;
        this.statusCode = statusCode;
        this.data = null
    }
}