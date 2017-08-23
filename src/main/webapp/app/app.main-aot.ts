import { platformBrowser } from '@angular/platform-browser';
import { ProdConfig } from './blocks/config/prod.config';
import { KavsirAppModuleNgFactory } from '../../../../target/aot/src/main/webapp/app/app.module.ngfactory';

ProdConfig();

platformBrowser().bootstrapModuleFactory(KavsirAppModuleNgFactory)
.then((success) => console.log(`Application started`))
.catch((err) => console.error(err));
