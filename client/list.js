const $list = $('.listContainer');
const $addbutton = $('.addButton');
const $listName = $('.listName');
let $activeItem = null;
let activeUser;
let activeUserPic;

$.get('/activeSession').done(session => {
  activeUser = session.cookieId;
  activeUserPic = session.userPic;

  const $userPic = $('<img/>', {class: "userPic"});
  $userPic.attr('src', activeUserPic);
  $userPic.attr('height', '50px');
  $('.listNameContainer').prepend($userPic);
  $listName.text('What are you going to bring today, ' + activeUser + ' ?')
})

function addItems(results) {
  for (let i = 0; i < results.length; i++) {
    addItem(results[i]);
  }
}

function toggleOwnerAll(results, $elements) {
  for (let i = 0; i < results.length; i++) {
    toggleOwner(results[i], $elements[i]);
  }
}


//POPULATES LIST WITH ITEMS 
function addItem(result) {
  console.log("RESULT", result)
  let $itemContainer = $('<div/>', { class: 'itemContainer' });
  let $checkbox = $('<input/>', { class: 'itemState', type: 'checkbox' });
  let $label = $('<span/>', { class: 'itemLabel' })
  let $xbutton = $('<button/>', {class: 'itemRemove'})
  $xbutton.html('remove');

  $label.text(result.name);
  $itemContainer.append($checkbox, $label, $xbutton);
  $list.append($itemContainer);
  if (result.owner) {
    let $owner = $('<span/>', { class: 'itemOwner' });
    $owner.text(result.owner + ' is bringing this item!');
    $itemContainer.append($owner);
    $checkbox.attr('checked', true);
  }
  if(result.pic) {
    const $pic = $('<img/>', {class: "itemPic"});
   $pic.attr('src', result.pic);
    $pic.attr('height', '20px');
    $label.append($pic);
  }
}

//TOGGLES ITEM OWNER
function toggleOwner(data, $element) {
  let $prevowner = $element.find('.itemOwner')

  //REMOVE OWNER
  if ($prevowner.text()) {
    $prevowner.remove();
    data.owner = "";
    $.ajax({
      url: '/items',
      type: 'PUT',
      data: data
    })
    return true;
  }
  //ADD OWNER
  $.ajax({
    url: '/items',
    type: 'PUT',
    data: data
  })
  let $owner = $('<span/>', { class: 'itemOwner' });
  $owner.text(data.newState.owner + ' is bringing this item!');
  $element.append($owner);
}


//turns element into input field and sets as active item
function startEdit($element) {
  if ($activeItem) {
    endEdit($activeItem);
  }
  let $label = $element.find('.itemLabel');
  let text = $label.text();
  let $newInput = $('<input/>', { class: 'newInput', type: 'text', value: text })

  $label.hide();
  $element.prepend($newInput);
  $activeItem = $element;
}

function endEdit($element) {
  $element = $($element);
  let $input = $element.find('.newInput')
  let $label = $element.find('.itemLabel');
  let text = $input.val();

  //update database
  $.ajax({
    url: '/items',
    type: 'PUT',
    data: { itemName: $label.text(), newState : {name: text}}
  })
  $input.remove();
  $label.text(text);
  $label.show();
  $activeItem = null;
}



//POPULATE ITEMS
$.get('/items').done((results) => {
  addItems(results);
})


//ADD ITEMS TO LIST
$addbutton.on('click', (e) => {
  const data = { 'name': $('.addName').val(),
                  'pic': $('.addURL').val() 
                };
  $.post('/items', data).done(result => addItem(result))
});

$list.on('click', '.itemLabel', function (e) {
  let $item = $(e.target).closest('.itemContainer');
  startEdit($item);
})

//DELETE ITEMS
$list.on('click', '.itemRemove', (e) => {
  console.log("YOU CLICKED ME!!", e.target)
  let $target = $(e.target).closest('.itemContainer');
  let $label = $target.find('.itemLabel');

  //send delete request
   $.ajax({
    url: '/items',
    type: 'DELETE',
    data: { itemName: $label.text()}
  }).done((result)=>{

    //res.result.name
    $target.remove();
  })
});

$list.on('click', '.itemLabel', function (e) {
  let $item = $(e.target).closest('.itemContainer');
  startEdit($item);
})


//ADD ACTIVE USER TO ACTIVE ITEM
$list.on('click', '.itemState', function (e) {
  let id = activeUser || "anon";
  let $item = $(e.target).closest('.itemContainer');
  let itemName = $item.find('.itemLabel').text();
  const data = {itemName: itemName, newState: {owner: id}};

  //toggles owner on database and displays items
  toggleOwner(data, $item);

})


// AFTER CLICK OFF CHANGE BACK TO UNEDITABLE
$('body').on('click', (e) => {
  let $target = $(e.target).closest('.itemContainer');
  if ($activeItem) {
    if ($target[0] !== $activeItem[0]) {
      endEdit($activeItem[0]);
    }
    else {
      console.log('wooops!')
    }
  }
})




