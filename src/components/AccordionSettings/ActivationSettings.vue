<template>
	<div>
		<GLSLEditor v-model="code" ref="editor"/>
		<div id='error'> {{ error }} </div>
		<div id='dropdown'>
				Activation Functions: <select v-model="selected" @change="select()">
				<option v-for="(activation, i) in activations "
					v-bind:value="activation" 
					:key="i" >
					{{activation.name}}
				</option>
			</select>
		</div>
		<WikiSection><ActivationWiki/></WikiSection>
	</div>
</template>

<script>
import WikiSection from '../Wiki/WikiSection.vue';
import ActivationWiki from '../Wiki/ActivationWiki.vue';

import Controller from '../../js/controller';
import GLSLEditor from './GLSLEditor.vue';

import activationList from '../../assets/activations.json';

export default {
	name: 'ActivationSettings',
	components: {
		GLSLEditor,
		ActivationWiki,
		WikiSection
	},
	data() {
		const activations = structuredClone(activationList); // deep copy, will modify
		return {
			code: Controller.activationSource,
			error: '',
			selected: activations[0],
			activations,
			ignore_change: false,
			pendingSetCode: null,
		}
	},
	methods: {
		parseError(error) {
			if (error) {
				error = error.substring(0, error.length-1);
				if (error.includes('float') && error.includes('int')){
					error = '(Use 1. instead of 1 for floats) '.concat(error);
				}
				this.error = error;
			}
			else {
				this.error = '';
			}
		},

		select() {
			this.ignore_change = true;
			this.code = structuredClone(this.selected.code);
		},

		refreshEditor() {
			this.$refs.editor.refresh();
		},
	},

	watch: {
		code() {
			if (this.ignore_change)
				this.ignore_change = false;
			else
				this.selected = undefined;
			if (this.pendingSetCode) {
				clearTimeout(this.pendingSetCode);
			}

			this.pendingSetCode = setTimeout(() => {
				Controller.activationSource = this.code;
				let error = Controller.apply(true);
				this.parseError(error);
				this.pendingSetCode = 0;
			}, 500);
		}
	}
}

</script>

<style scoped>

#dropdown {
	font-size: 14px;
	text-align: left;
	margin: 10px;
}

#error {
	margin: 5px;
	text-align: left;
	color: rgb(255, 0, 0);
	font-size: 14px;
	font-family: Consolas, 'SourceCodePro-Medium', monaco, monospace;
}
</style>