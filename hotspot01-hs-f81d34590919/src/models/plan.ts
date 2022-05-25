import { DurationType } from "./enum";

export class PlanModule {
  _id: number;
  duration_val: number;
  duration_type: DurationType;
  bytes_t: number;
  speed_dl: number;
  speed_ul: number;
  price: number;
  currency: string;
  plan_name: string;
}
