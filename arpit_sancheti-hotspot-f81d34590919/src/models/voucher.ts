import { PlanModule } from "./plan";

export class Voucher {
    duration_val: number;
    duration_type: string;
    num_devices: number;
    batchid: string;
    number: number;
    notes: string;
    bytes_t: number;
    speed_dl: number;
    speed_ul: number;
    price: number;
    currency: string;

    constructor(plan?: PlanModule) {
        if (plan) {
            this.duration_val = plan.duration_val;
            this.duration_type = '2';
            this.num_devices = 1;
            this.batchid = '1234';
            this.number = 1;
            this.notes = '';
            this.bytes_t = plan.bytes_t;
            this.speed_dl = plan.speed_dl;
            this.speed_ul = plan.speed_ul;
            this.price = plan.price;
            this.currency = 'XCD';
        } else {
            this.duration_val = null;
            this.duration_type = null;
            this.num_devices = null;
            this.batchid = null;
            this.number = null;
            this.notes = null;
            this.bytes_t = null;
            this.speed_dl = null;
            this.speed_ul = null;
            this.price = null;
            this.currency = null;
        }
    }

    validate(): boolean {
        if (!this.duration_val && this.duration_val <= 0) {
            return false;
        }
        if (!this.duration_type) {
            return false;
        }
        if (!this.num_devices && this.num_devices <= 0) {
            return false;
        }
        if (!this.batchid && this.batchid.trim() != '') {
            return false;
        }
        if (!this.number && this.number <= 0) {
            return false;
        }
        return true;
    }
}
