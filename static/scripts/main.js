function updatePortfolioTag(portfolio) {
    var left = true;
    for (var pObj of portfolio){
        if (left){
            $(pObj).removeClass('portfolio-reverse');
            $($(pObj).find('div.portfolio-picture')).prependTo($(pObj));
            $($(pObj).find('div.portfolio-text')).attr('data-aos', 'fade-left');
            $($(pObj).find('div.portfolio-text div')).removeClass('text-end');
        } else {
            $(pObj).addClass('portfolio-reverse');
            $($(pObj).find('div.portfolio-picture')).appendTo($(pObj));
            $($(pObj).find('div.portfolio-text')).attr('data-aos', 'fade-right');
            $($(pObj).find('div.portfolio-text div')).addClass('text-end');
        }
        left = !left;
    }
}(jQuery);

function changePage(currPage, rowsShown, portfolios, paginationNavClass, sectionType) {
    var currPageObj = $(paginationNavClass + ' li.normal div[rel='+currPage+']')[0].parentNode
    $(paginationNavClass + ' li.normal').removeClass('active');
    $(currPageObj).addClass('active');
    var startItem = currPage * rowsShown;
    var endItem = startItem + rowsShown;
    $(sectionType + ' div.row').hide();
    $(portfolios.slice(startItem, endItem)).fadeIn();
    AOS.refresh();
}(jQuery);

function showTag(tag, allPortfolios, rowsShown, paginationNavClass, sectionType) {
    var portfolios = $(allPortfolios[tag]);
    var rowsTotal = parseInt(portfolios.length);
    var numPages = Math.ceil(rowsTotal/rowsShown);
    var currPage = parseInt(0);
    var selectedTag = tag;

    $(paginationNavClass).empty();
    $(paginationNavClass).append('<li class="page-item special"><div class="pagination-item" href="#" aria-label="First" rel="first"><span aria-hidden="true"><<</span></div></li>');
    $(paginationNavClass).append('<li class="page-item special"><div class="pagination-item" href="#" aria-label="Previous" rel="previous"><span aria-hidden="true"><</span></div></li>');
    for (i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $(paginationNavClass).append('<li class="page-item normal"><div class="pagination-item" href="#" rel="'+i+'">'+pageNum+'</div></li>');
    }
    $(paginationNavClass).append('<li class="page-item special"><div class="pagination-item" aria-label="Next" rel="next"><span aria-hidden="true">></span></div></li>');
    $(paginationNavClass).append('<li class="page-item special"><div class="pagination-item" aria-label="Last" rel="last"><span aria-hidden="true">>></span></div></li>');

    $(paginationNavClass + ' li.normal:first').addClass('active');
    $(paginationNavClass + ' li.normal').bind('click', function(e) {
        currPage = parseInt($(this).find('div').attr('rel'));
        changePage(currPage, rowsShown, allPortfolios[selectedTag], paginationNavClass, sectionType);
        e.preventDefault();
    });

    $(paginationNavClass + ' li.special').bind('click', function(e) {
        var type = $(this).find('div').attr('rel');
        if (type === 'first') {
            currPage = 0
        } else if (type === 'last') {
            currPage = numPages - 1
        } else if (type === 'previous') {
            if (currPage - 1 >= 0){
                currPage = currPage - 1
            }
        } else if (type === 'next') {
            if (currPage + 1 < numPages){
                currPage = currPage + 1
            }
        }
        changePage(currPage, rowsShown, allPortfolios[selectedTag], paginationNavClass, sectionType);
    });
    updatePortfolioTag(portfolios);
    changePage(currPage, rowsShown, portfolios, paginationNavClass, sectionType);
    return [portfolios, numPages, currPage, selectedTag];
}(jQuery);

// Add your javascript here
$(document).ready(function(){
    // find portfolio skills
    var allPortfolios = {'All': []}
    for (var pObj of $('#portfolio-section div.row')){
        var objTags = $(pObj).find('p.text-small')[0].innerText.split(' / ');
        allPortfolios['All'].push(pObj);
        for (var tag of objTags){
            if (!(tag in allPortfolios)) {
                allPortfolios[tag] = [pObj];
            } else {
                allPortfolios[tag].push(pObj);
            }
        }
    }

    // create portfolio tag set
    for (var tag of Object.keys(allPortfolios).sort()){
        $('#portfolio-chip-set').append('<div class="mdc-chip"><div class="mdc-chip__text" rel="'+tag+'">'+tag+'</div></div>')
    }

    // show All tag
    $('#portfolio-chip-set div.mdc-chip:first').addClass('mdc-chip-selected');
    var rowsShown = 2;
    var [portfolios, numPages, currPage, selectedTag] = showTag('All', allPortfolios, rowsShown, '#nav-pagination', '#portfolio-section')

    $('#portfolio-chip-set div.mdc-chip').bind('click', function(e) {
        tag = $(this).find('div').attr('rel');
        // toggle selected
        $('#portfolio-chip-set div.mdc-chip').removeClass('mdc-chip-selected');
        $(this).addClass('mdc-chip-selected');
        [portfolios, numPages, currPage, selectedTag] = showTag(tag, allPortfolios, rowsShown, '#nav-pagination', '#portfolio-section')
    });

    // create fake blog skills
    if($('#blog-section').length > 0) {
        var allBlogs = {'All': []}
        for (var pObj of $('#blog-section div.row')){
            allBlogs['All'].push(pObj);
        }
        console.log('hmm')
        showTag('All', allBlogs, rowsShown, '#blog-nav-pagination', '#blog-section')
    }
});