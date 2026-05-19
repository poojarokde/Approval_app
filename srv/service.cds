using { my.sales as db } from '../db/schema';

service SalesService {

    entity SalesOrders as projection on db.SalesOrders;

    entity ApprovalTasks as projection on db.ApprovalTasks actions {

        action approveTask();

        action rejectTask();

    };

}