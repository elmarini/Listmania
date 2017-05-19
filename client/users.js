$.get('/allUsers').done((users) => {
    addUsers(users);
})


function addUsers(results) {
    for (let i = 0; i < results.length; i++) {
        addUser(results[i]);
    }
}

//POPULATES DIV WITH USERS 
function addUser(result) {
    let $userContainer = $('<div/>', { class: 'userContainer' });
    let $label = $('<span/>', { class: 'userLabel' })
    const $pic = $('<img/>', { class: "userPic" });

    $('.userList').append($userContainer);
    $userContainer.append($label);
    $label.text(result.username);
    $label.prepend($pic);

    if (result.profilepic) {
        $pic.attr('src', result.profilepic);
        $pic.attr('height', '40px');
    }
    else{
        $pic.attr('src', 'http://mobilevarsity.com/photos/profile-pic.png');
        $pic.attr('height', '40px');
    }
}