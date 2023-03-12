
// export async function longPolling(res,session,cnt)
// {
//     //context: res is the object we use to respond to the client
//     //session: just some info about the client, irrelevant here
//     //cnt: initially 0

//     //nothing to tell the client, let's long poll.
//     if  (nothing_to_send(res,session))
//     {
//         if (cnt<MAX_LONG_POLL_TIME)
//         {
//             //call this function in 100 ms, increase the counter
//             setTimeout(function(){respond_to_client(request_id,res,session,cnt+1)},100);
//         }
//         else
//         {
//             close_connection(res);
//             //Counter too high.
//             //we have nothing to send and we kept the connection for too long,
//             //close it. The client will open another.
//         }
//     }
//     else
//     {
//         send_what_we_have(res);
//         close_connection(res);
//         //the client will consume the data we sent,
//         //then quickly send another request.
//     }

//     return;

// }
