const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');
const { SELECT, INSERT, UPDATE } = cds.ql;

module.exports = async (srv) => {

    const external = await cds.connect.to('API_SALES_ORDER');
    const db = await cds.connect.to(cds.db);

    srv.on('READ', 'SalesOrders', async (req) => {

        const data = await external.get('/carts');

        const db = await cds.connect.to('db');

        for (const order of data.carts) {

            const orderValue = order.total * 100;

            let approvalRequired = false;

            if (orderValue > 1000000 || order.products.length > 4) {
                approvalRequired = true;

                // Check if task already exists
                const existing = await db.run(
                    SELECT.from('my.sales.ApprovalTasks')
                        .where({ salesOrderID: order.id })
                );

                if (existing.length === 0) {
                    await db.run(
                        INSERT.into('my.sales.ApprovalTasks').entries({
                            ID: uuidv4(),
                            salesOrderID: order.id,
                            approver: 'Manager1',
                            status: 'PENDING',
                            createdAt: new Date()
                        })
                    );
                }
            }
        }

        return data.carts.map(order => {

            let discount = '0%';
            let risk = 'LOW';
            let approvalRequired = false;
            let criticality = 3;

            const orderValue = order.total * 100;

            if (orderValue > 500000) {
                discount = '10%';
            } else if (orderValue > 200000) {
                discount = '5%';
            }

            if (orderValue > 1000000) {
                risk = 'HIGH';
                approvalRequired = true;
                criticality = 1;
            } else if (orderValue > 300000) {
                risk = 'MEDIUM';
                criticality = 2;
            }

            if (order.products.length > 4) {
                risk = 'HIGH';
                approvalRequired = true;
                criticality = 1;
            }

            return {
                ID: order.id,
                customerName: `Customer ${order.userId}`,
                orderValue,
                currency: 'INR',
                status: approvalRequired ? 'Pending Approval' : 'Approved',
                discount,
                risk,
                approvalRequired,
                criticality
            };
        });
    });


    srv.on('approveTask', 'ApprovalTasks', async (req) => {

        const ID = req.params[0].ID;

        const db = await cds.connect.to('db');

        await db.run(
            UPDATE('my.sales.ApprovalTasks')
                .set({ status: 'APPROVED' })
                .where({ ID })
        );

        return await db.run(
            SELECT.one.from('my.sales.ApprovalTasks')
                .where({ ID })
        );
    });


    srv.on('rejectTask', 'ApprovalTasks', async (req) => {

        const ID = req.params[0].ID;

        const db = await cds.connect.to('db');

        await db.run(
            UPDATE('my.sales.ApprovalTasks')
                .set({ status: 'REJECTED' })
                .where({ ID })
        );

        return await db.run(
            SELECT.one.from('my.sales.ApprovalTasks')
                .where({ ID })
        );
    });
};