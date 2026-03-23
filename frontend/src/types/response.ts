export class BadResponse extends Error {
    status: number
    contentType: string | undefined
    constructor(status: number, message: any, contentType?: string) {
      super(message);
      this.message = message;
      this.status = status;
      this.contentType = contentType;
    }

    toResponse(){
      const response = new Response(this.message, { status: this.status });
      if(this.contentType){
        response.headers.set('Content-Type', this.contentType);
      }
        return response;
    }
  }