annotate SalesService.ApprovalTasks with @(

    UI.HeaderInfo: {
        TypeName: 'Approval Task',
        TypeNamePlural: 'Approval Tasks',
        Title: {
            Value: approver
        },
        Description: {
            Value: status
        }
    },

    UI.LineItem: [

        {
            Value: salesOrderID,
            Label: 'Sales Order'
        },

        {
            Value: approver,
            Label: 'Approver'
        },

        {
            Value: status,
            Label: 'Status'
        }
    ],

    UI.Identification: [

        {
            Value: salesOrderID,
            Label: 'Sales Order'
        },

        {
            Value: approver,
            Label: 'Approver'
        },

        {
            Value: status,
            Label: 'Current Status'
        },

        {
            $Type: 'UI.DataFieldForAction',
            Action: 'SalesService.approveTask',
            Label: 'Approve'
        },

        {
            $Type: 'UI.DataFieldForAction',
            Action: 'SalesService.rejectTask',
            Label: 'Reject'
        }
    ]
);