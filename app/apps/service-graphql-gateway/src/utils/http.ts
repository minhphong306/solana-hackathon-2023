import {HttpService} from '@nestjs/axios';
import {map} from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const doPost = (service: HttpService, uri: string, body: any): Promise<any> => {
  return service.post(uri, body, {
    headers: {
      Accept: 'application/json'
    }
  })
    .pipe(
      map((res) => {
        return res.data;
      })
    )
    .toPromise();
};

export const doGet = (service: HttpService, uri: string) => {
  return service.get(uri, {
    headers: {
      'Accept': 'application/json'
    }
  }).pipe(map((res) => {
    return res.data;
  })).toPromise();
};
