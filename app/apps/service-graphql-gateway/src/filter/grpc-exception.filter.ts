import {Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import {HttpAdapterHost} from "@nestjs/core";
import {getHttpCodeFromGrpcCode} from "../utils/grpc.error-code";


@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(e: unknown): void {
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = 'Something went wrong';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (e && e?.details && e?.code) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      httpStatus = getHttpCodeFromGrpcCode(e.code);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      msg = e?.details;
      throw new HttpException(msg, httpStatus);
    }
  }
}
