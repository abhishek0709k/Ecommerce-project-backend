export class ApiResponse{
    constructor(
        message="Success",
        statusCode,
        data,
    ){
        this.message = message;
        this.statusCode = statusCode,
        this.data = data
    }
}