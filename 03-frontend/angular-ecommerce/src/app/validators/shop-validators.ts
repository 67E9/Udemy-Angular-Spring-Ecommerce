import { FormControl } from "@angular/forms";

export class ShopValidators {

static notOnlyWhiteSpace(control : FormControl){
    //check if string only contains whitespace
    if((control.value != null) && (control.value.trim().length === 0)){
        //invalid, return error object
        return {'notOnlyWhiteSpace': true}
    } else {
        return null; //valid: return null
    }
}

}
