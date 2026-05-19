service ExternalSalesService {
  entity Orders {
    key id        : Integer;
    total         : Decimal(10,2);
    userId        : Integer;
    status        : String;
  }
}