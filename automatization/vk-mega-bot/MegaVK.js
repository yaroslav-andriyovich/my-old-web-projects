const { VK } = require('vk-io');

const MEGA = new VK({
	token: '#TOKEN#'
});

async function SetStatus(status)
{
    var res = await MEGA.api.account.saveProfileInfo( { status: status } );
    console.debug(res);
}

async function OnNewMessage(context)
{
    console.debug("New private message:");
    console.debug(context);
}

async function CheckFriendRequests()
{
    var newRequests = (await MEGA.api.friends.getRequests( { need_viewed: true } )).items;

    if (newRequests.length <= 0)
        return;

    for (req in newRequests)
    {
        MEGA.api.friends.add( { user_id: newRequests[req] } );
    }
}

module.exports = { 
    MEGA,
    OnNewMessage,
    CheckFriendRequests
};