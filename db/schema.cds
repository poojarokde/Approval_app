namespace my.sales;

entity SalesOrders {
  key ID              : Integer;
  customerName        : String;
  orderValue          : Decimal(15,2);
  currency            : String(3);
  status              : String;
  discount            : String;
  risk                : String;
  approvalRequired    : Boolean;
  criticality         : Integer;
}
entity ApprovalTasks {
  key ID           : UUID;
  salesOrderID     : Integer;
  approver         : String;
  status           : String;
  createdAt        : Timestamp;
}