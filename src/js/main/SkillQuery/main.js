import Grimoire from "../Grimoire.js";
import SkillSystem from "../../SkillSystem/SkillSystem.js";
import CharacterSystem from "../../CharacterSystem/CharacterSystem.js";
import TagSystem from "../../TagSystem/TagSystem.js";
import {startLoadingMsg, loadingMsg, loadingFinished} from "../module/LoadingPage.js";
import {readyFirst, ready} from "./ready.js";

async function start(){
    const status = {
        no_error: true
    };
    
    readyFirst();

    Grimoire.SkillSystem = new SkillSystem();
    Grimoire.CharacterSystem = new CharacterSystem();
    Grimoire.TagSystem = new TagSystem();

    await startLoadingMsg('載入角色能力清單...');
    await Grimoire.CharacterSystem.init_statList().catch(() => loadingMsg('...載入失敗。', true, status));
    await startLoadingMsg('載入技能清單...');
    await Grimoire.SkillSystem.init().catch(() => loadingMsg('...載入失敗。', true, status));
    
    await startLoadingMsg('初始化技能資料...');
    Grimoire.SkillSystem.init_SkillQuery(document.querySelector('#SkillQuery > .main'));

    await startLoadingMsg('載入標籤清單...');
    await Grimoire.TagSystem.init({mainNode: document.getElementById('tag-scope')}).catch(() => loadingMsg('...載入失敗。', true, status));

    ready();

    if ( status.no_error )
        loadingFinished();
}

try {
    start();
}
catch(e) {
    loadingMsg(e);
    console.log(e);
}

