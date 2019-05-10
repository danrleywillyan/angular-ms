import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderComponent} from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  public app: string;
  public path: string;
  public method: string;

  public port = '8080';
  public host = 'docker';
  public protocol = 'http';

  public params: object;

  constructor(protected http: HttpClient, protected loader: LoaderComponent) { }

  protected loading(promise) {
    this.loader.start();

    promise.subscribe( data => {
      console.log('data', data);
      setTimeout( () => { this.loader.stop(); }, 500);
    }, error => {
      console.log('error', error);
      setTimeout( () => { this.loader.stop(); }, 500);
    });
  }

  protected perform() {
    return this.http.request(this.method, this.mountURL(), this.options());
  }

  private options() {
    return {
      body: this.params
    };
  }

  private mountURL() {
    return `${this.protocol}://${this.host}:${this.port}/${this.app}/${this.path}`;
  }

}
