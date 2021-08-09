
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "Ensure that Login & Signup Works!",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        let wallet_1 = accounts.get('wallet_1')!;
        let block = chain.mineBlock([
            Tx.contractCall('Auth', 'login-check', [types.ascii("ummarikram"), types.ascii("smart")], wallet_1.address),
            Tx.contractCall('Auth', 'sign-up', [types.ascii("ummarikram"), types.ascii("smart")], wallet_1.address),
            Tx.contractCall('Auth', 'login-check', [types.ascii("ummarikram"), types.ascii("smart")], wallet_1.address),
            Tx.contractCall('Auth', 'change-password', [types.ascii("ummarikram"), types.ascii("contract")], wallet_1.address),
            Tx.contractCall('Auth', 'login-check', [types.ascii("ummarikram"), types.ascii("smart")], wallet_1.address),
            Tx.contractCall('Auth', 'sign-up', [types.ascii("ummarikram"), types.ascii("smart")], wallet_1.address),
        ]);

        assertEquals(block.receipts.length, 6);
        assertEquals(block.height, 2);

        // User does not exist so expect error & false
        block.receipts[0].result
            .expectErr()
            .expectBool(false)

           // User Created successfully so true 
            block.receipts[1].result
            .expectOk()
            .expectBool(true)
        
            // Now Login will give no error
            block.receipts[2].result
            .expectOk()
            .expectBool(true)

            // Change Password of user that was created earlier
            block.receipts[3].result
            .expectOk()
            .expectBool(true)

            // Login with previous password will fail
            block.receipts[4].result
            .expectErr()
            .expectBool(false)

            // Sign up of existing user will fail
            block.receipts[5].result
            .expectErr()
            .expectBool(false)
    },
});
