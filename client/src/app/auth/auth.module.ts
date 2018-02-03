import { NgModule, FormsModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
	declarations: [
		LoginComponent,
		SignupComponent
	],
	imports: [
		AuthRoutingModule,
		FormsModule,
		CommonModule
	]
})
export class AuthModule {
}