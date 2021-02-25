'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML)
}

const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href');
  const targetArticle = document.querySelector(articleSelector);
  targetArticle.classList.add('active');
};

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsListSelector = '.post-tags .list',
  optArticleTagsSelector = '.post-tags .list li a',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optArticleAuthorSelector = '.post-author';

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    titleList.innerHTML = titleList.innerHTML + linkHTML;
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

const tagClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  const foundTags = document.querySelectorAll('a[href="'+ href +'"]');

  for (let foundTag of foundTags) {
    foundTag.classList.add('active');
  }
  generateTitleLinks('[data-tags~="'+ tag+'"]');
}

function calculateTagsParams(tags){
  const params = {
    min: [999999],
    max: [0]
  }
  for (let tag in tags){
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
    console.log(tag + ' is used ' + tags[tag] + ' times');
  }
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for(let article of articles){
    const tagsList = article.querySelector(optArticleTagsListSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');

    for(let tag of articleTagsArray){
      //const linkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      const linkTagData = {tag: tag};
      const tagHTML = templates.articleTag(linkTagData);
      html = html + tagHTML;

      if (!allTags[tag]) {
        allTags[tag] = 1;
      } else;{
        allTags[tag]++;
      }
    }
    tagsList.innerHTML = html;
    const tags = document.querySelectorAll(optArticleTagsSelector);

    for (let tag of tags) {
      tag.addEventListener('click', tagClickHandler);
    }
  }

  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';

  for(let tag in allTags){
    const tagLinkHTML = `<li><a class="${calculateTagClass(allTags[tag], tagsParams)}" href="#tag-${tag}">${tag}</a></li>`
    allTagsHTML += tagLinkHTML;
  }

  tagList.innerHTML = allTagsHTML;

  const allTagsInList = tagList.querySelectorAll('a');
  for (let tag of allTagsInList) {
    tag.addEventListener('click', tagClickHandler);
  }
}

generateTags();

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const articleAuthorHTML = article.querySelector(optArticleAuthorSelector);
    const author = article.getAttribute('data-author');
    const link = `<a href="#author-${author}"><span>by ${author}</span></a>`;
    articleAuthorHTML.innerHTML = link;

    if (!allAuthors[author]){
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
    // ADD EVENT LISTENER TO articleAuthorHTML

  }
  const authorList = document.querySelector('.authors');
  let html = '';

  for (const author in allAuthors) {
    const link = `<li><a href="#author-${author}"><span>${author} ${allAuthors[author]}</span></a></li>`
    html += link;
  }

  authorList.innerHTML = html;
  const allAuthorsInList = authorList.querySelectorAll('a');

  for (const author of allAuthorsInList){
    // ADD EVENT LISTENER TO author

    }
}
generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    author = href.replace('#author-', ''),
    activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  for (let activeAuthor of activeAuthors){
    activeAuthor.classList.remove('active');
  }
  const clickedAuthors = document.querySelectorAll('a[href="' + href + '"]');
  for (let clickedAuthor of clickedAuthors){
    clickedAuthor.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const authors = document.querySelectorAll('a[href^="#author-"]');
  for (let author of authors){
    author.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();

