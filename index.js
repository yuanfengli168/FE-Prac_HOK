// IIFE to prevent contamination of global scope
(async function () {
  /**
   * 从网络获取当前的英雄数据
   * @returns Promise
   */
  async function getHeroes() {
    return fetch('https://study.duyiedu.com/api/herolist')
      .then((resp) => resp.json())
      .then((resp) => resp.data.reverse());
  }

  const doms = {
    ul: document.querySelector('.heroes'),
    radios: document.querySelectorAll('.radio'),
    textInput: document.querySelector('input.searchBox'),
  }

  // 1. 初始化： 加载所有英雄数据，生成li，加入到ul中
  // const arrOfHeroes = getHeroes().then(data => console.log(data));
  const arrOfAllHeroes = await getHeroes();  // have to add async before IIFE
  // console.log(arrOfAllHeroes); 
  setHeroHTML(arrOfAllHeroes);

  /**
   * 根据指定的英雄数组，生成对应的html，放入到ul中
   * @param {*} heroes 
   * 
   */
  function setHeroHTML(heroes) {
    const htmlContent = heroes.map(hero => `<li><a href=https://pvp.qq.com/web201605/herodetail/${hero.ename}.shtml target="_blank">
          <img src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${hero.ename}/${hero.ename}.jpg" alt="">
          ${hero.cname}
        </a></li>`)
    // console.log(htmlContent);
    doms.ul.innerHTML = htmlContent.join('');
  }


  // 2. 交互事件：
  for (const radio of doms.radios) {
    radio.addEventListener('click', () => {
      // console.log(radio);
      // 1. change the radio's style
      setChoose(radio);

      // 2. change ul's content/array of data!
      const heroType = getDOMHeroType(radio);  //return a number
      const resultArr = !heroType ? arrOfAllHeroes : getFilterArr(heroType);
      
      setHeroHTML(resultArr);
    })
  }

  doms.textInput.addEventListener('input', (e) => {
    // console.log(e.target.value);
    // 设置全部选中
    setChoose(document.querySelector(".radio[data-type='all']"))
    const filterArr = arrOfAllHeroes.filter(hero => hero.cname.includes(e.target.value));
    setHeroHTML(filterArr);
  })

  const getFilterArr = (heroType) => {
    return arrOfAllHeroes.filter(hero => {
      if (heroType < 7) {
        return  hero.hero_type === heroType || hero.hero_type2 === heroType;
      }
      if (heroType > 7) {
        return hero.pay_type === heroType;
      }
    })
  }

  /**
   * returns the number of the hero type
   * @param {DOMElment} dom 
   * @returns {number} the number indicating which type it is. 0 means not found/undefined, if not found;
   */
  function getDOMHeroType(dom) {
    // the index 0 means 1, and each index's value is its heroType
    const heroTypes = ['战士', '法师','坦克','刺客','射手','辅助'];
    const payTypes = {
      "本周免费": 10,
      "新手推荐": 11
    }
    const domType = dom.textContent;
    return heroTypes.indexOf(domType) + 1 || payTypes[domType];
  }

  /**
   * 设置某个被选中的radio
   */
  function setChoose(radio) {
    const prev = document.querySelector('.radio.checked');
    prev && prev.classList.remove("checked");
    radio.classList.add("checked");
  }
})()


