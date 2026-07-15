<template>
    <div>
        Neural Patterns is a web toy built to run simple neural cellular automata (NCA) in the browser.
        These simple NCAs generate each frame by applying a convolution and activation to each pixel:
        <br>
        <hr>
        <WikiSection title="Convolution:"><ConvolutionWiki/></WikiSection>
        <hr>
        <WikiSection title="Activation:"><ActivationWiki/></WikiSection>
        <hr>
        <b>   Controls: </b>
        <ul>
            <li><b>Left Click</b> - Draw pixels of value 1.0</li>
            <li><b>Right Click</b> - Draw pixels of value 0.0</li>
            <li><b>Scroll</b> - Zoom in/out</li>
            <li><b>Spacebar</b> - Pause/Play</li>
        </ul>

        <a href="https://github.com/MaxRobinsonTheGreat/webgl-convolution" target="_blank">The code</a>
         is open source, feel free to expand on it. Powered with vue, webgl, and lots of coffee.
        <br><br>

    </div>

</template>

<script>
import WikiSection from '../Wiki/WikiSection.vue';
import ActivationWiki from '../Wiki/ActivationWiki.vue';
import ConvolutionWiki from '../Wiki/ConvolutionWiki.vue';

export default {
    name: 'About',
    components: {
        WikiSection,
        ActivationWiki,
        ConvolutionWiki
    }
}
</script>

<style scoped>
div {
    text-align: left;
    font-size: 14px;
    margin: 3px;
}
span{
    display: inline-block;
    white-space: nowrap;
}
</style>

