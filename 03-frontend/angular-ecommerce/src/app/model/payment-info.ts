export class PaymentInfo {

    constructor(
        public amount?: number, //amount to be paid in cents
        public currency?: string,
        public receiptEmail?: string,
    ){}

}
