/*Settings
Most things that you might need to change are located here
*/

var settings = {
  //Menu Identifier. The class or id of your element containing your menu
  menuIdentifier: '.subNavigation',
  //Active Class. The class to assign a 
  activeClass: '.active',
  refreshTime: 10,
}

/*
First section highlights text as per this resource
http://jsfiddle.net/mekwall/up4nu/
Credit to the Author (who I cannot locate)
*/

//Top Menu

// Cache selectors
var lastId,
    topMenu = $(settings.menuIdentifier),
    topMenuHeight = topMenu.outerHeight()+15,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e){
  var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
  $('html, body').stop().animate({ 
      scrollTop: offsetTop
  }, 300);
  e.preventDefault();
});

// Bind to scroll
$(window).scroll(function(){
   // Get container scroll position
   var fromTop = $(this).scrollTop()+topMenuHeight;
   
   // Get id of current scroll item
   var cur = scrollItems.map(function(){
     if ($(this).offset().top < fromTop)
       return this;
   });
   // Get the id of the current element
   cur = cur[cur.length-1];
   var id = cur && cur.length ? cur[0].id : "";
   
   if (lastId !== id) {
       lastId = id;
       // Set/remove active class
       menuItems
         .parent().removeClass("active")
         .end().filter("[href=#"+id+"]").parent().addClass("active");
   }                   
});



//Add Class subNavHide on document load so that the document is still readable by those without js.
        $(document).ready(function(){
            $('.subNavigation').addClass('subNavHide');
        });

        //Calculate the hight of element above subMenu. This is used when applying the class that fixes the sub Menu position
        var titleHeight = $('.pageTitle').outerHeight();
        var mainMenuHeight = $('.mainMenu').outerHeight();
        var moveHeight =  titleHeight - mainMenuHeight;

        var scrollTimer = null;

        //Scroll function. The code inside this event listener ensures that the code ('handleScroll') is only executed one the refresh time is reached.
        $(window).scroll(function () {
            if (scrollTimer) {
                clearTimeout(scrollTimer); // clear any previous pending timer
            }
            scrollTimer = setTimeout(handleScroll, settings.refreshTime); // set new timer
        });

            //Function handleScroll is called in the scroll event above
            function handleScroll() {
                scrollTimer = null;
                //ScrollHeight fetches the position of the scroll bar. This section fixes the scroll bar if element above the menu has moved off the page and removed it if it reapears.
                scrollHeight = $(document).scrollTop();
                if (scrollHeight > moveHeight){
                    $(settings.menuIdentifier + 'ul').addClass('subNavigationPosition');
                }
                else {
                    $(settings.menuIdentifier + 'ul').removeClass('subNavigationPosition');
                }
                //Select the active anchors parent
                target =  $('.active').parent();
                //If the elements ('.active') parent is a li (and thus a subcategory) give that parent a class. This class displays the subcategory list.
                if ( target.parent().is("li")){
                    $('.active').parent().addClass('activeParent');
                }
                //if the active class is not a subcategory then remove class active parent, hiding the subcategory
                else if(target.is("ul")){
                    $('.activeParent').removeClass('activeParent');
                }
            }