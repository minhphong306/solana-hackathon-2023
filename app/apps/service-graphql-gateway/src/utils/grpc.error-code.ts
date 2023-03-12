import {status} from "@grpc/grpc-js";
import {HttpStatus} from "@nestjs/common";

export const getHttpCodeFromGrpcCode = (grpcCode: number): number => {
  switch (grpcCode) {
  case status.OK:
    return HttpStatus.OK;
  case status.INVALID_ARGUMENT:
    return HttpStatus.BAD_REQUEST;
  case status.DEADLINE_EXCEEDED:
  case status.INTERNAL:
    return HttpStatus.INTERNAL_SERVER_ERROR;
  default:
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
};
