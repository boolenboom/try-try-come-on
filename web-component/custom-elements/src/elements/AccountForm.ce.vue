<template>
    <dialog modal-mode="mega" open>
        <form id="login" method="dialog" enctype="multipart/form-data">
            <header>Login</header>
            <article>
                <label><p :class="{'toTheBorder': isToUp.username}">username</p> <input @focusout.capture="giveCheckValue" type="text" name="username"></label>
                <label><p :class="{'toTheBorder': isToUp.password}">password</p> <input @focusout.capture="giveCheckValue" type="password" name="password" ></label>
            </article>
            <footer>
                <menu>
                    <button type="reset">Clear</button>
                </menu>
                <menu>
                    <button value="cancel" onclick="this.closest('dialog').close('cancel')">Cancel</button>
                    <button type="submit" value="login">Login</button>
                </menu>
            </footer>
        </form>
    </dialog>
</template>
<style>
    dialog{
        display: grid;
        position: fixed;
        max-inline-size: min(90vw, 60ch);
        max-block-size: min(80vh, 100%);
        top: 0;
        bottom: 0;
        margin: auto;
        padding: 0;
        border-radius: 1rem;
        z-index: 3000;
        overflow: hidden;
        transition: opacity .5s ease;
    }
    #login{
        display: grid;
        grid-template-rows: auto 1fr auto;
        max-block-size: 80vh;
    }
    #login>header{
        padding-block: 1rem;
        padding-inline: 1.5rem;
        font-size: 24px;
        font-weight: 700;
    }
    #login>article{
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-inline: 1.5rem;
        padding-block-end: 2rem;
    }
    article>label{
        position: relative;
    }
    article>label:focus-within>p,.toTheBorder{
        transform: translateY(-75%) scale(.9);
    }
    article>label>p{
        position: absolute;
        height: 1.5rem;
        top: 0;
        bottom: 0;
        margin-block: auto;
        margin-inline-start: .5rem;
        text-transform: capitalize;
        font-size: 1.5rem;
        line-height: .75;
        transform-origin: left;
        transition: transform .5s ease;
        background-image: linear-gradient(#fff 0%, #fff 50%, transparent 50%, transparent);
    }
    article>label>input{
        width: 300px;
        height: calc(1rem + 24px);
        box-sizing: border-box;
        border-radius: .5rem;
        padding-inline-start: .5rem;
    }
    #login>footer{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-inline: 1.5rem;
    }
    #login>footer>menu{
        display: flex;
        gap: 1rem;
        padding-inline-start: 0;
    }
</style>
<script setup>
import { reactive } from 'vue';

let isToUp = reactive({
    username:false,
    password:false,
});

function giveCheckValue(evt){
    isToUp[evt.path[0].name] = (evt.path[0].value !== '');
}
</script>