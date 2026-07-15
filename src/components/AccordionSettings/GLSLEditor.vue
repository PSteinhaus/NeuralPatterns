<template>
    <textarea ref="textarea"></textarea>
  </template>
  
  <script>
  import { onMounted, onBeforeUnmount, ref, watch } from "vue";
  
  import CodeMirror from "codemirror/lib/codemirror.js";
  import "codemirror/lib/codemirror.css";
  
  import "codemirror/addon/comment/comment.js";
  
  import "./glslmode";
  
  export default {
    name: "GLSLEditor",
  
    props: {
      modelValue: {
        type: String,
        default: ""
      }
    },
  
    emits: [
      "update:modelValue"
    ],
  
    setup(props, { emit, expose }) {
      const textarea = ref(null);
      let editor = null;
  
      const setValue = (value) => {
        if (!editor) return;
  
        if (editor.getValue() !== value) {
          editor.setValue(value);
        }
      };
  
      onMounted(() => {
        editor = CodeMirror.fromTextArea(textarea.value, {
          theme: "glsl",
          mode: "glsl",
          viewportMargin: Infinity,
          lineNumbers: false,
          lineWrapping: true,
          extraKeys: {
            "Ctrl-/": toggleGLSLComment,
            "Cmd-/": toggleGLSLComment
          }
        });
  
        editor.setValue(props.modelValue);
  
        editor.on("change", () => {
          emit("update:modelValue", editor.getValue());
        });
  
        expose({
          editor,
          refresh() {
            editor.refresh();
          },
          setValue
        });
  
        // CodeMirror sometimes calculates the size incorrectly
        // immediately after creation.
        setTimeout(() => {
          editor.refresh();
        }, 100);
      });
  
      onBeforeUnmount(() => {
        if (editor) {
          editor.toTextArea();
          editor = null;
        }
      });
  
      watch(
        () => props.modelValue,
        (value) => {
          setValue(value);
        }
      );
  
      return {
        textarea
      };
    }
  };
  
  
  function toggleGLSLComment(cm) {
    cm.toggleComment({
      indent: true,
      lineComment: "//"
    });
  }
  </script>
  
  <style>
  .CodeMirror {
    height: auto;
    min-height: 150px;
    text-align: left;
    font-family: Consolas, "SourceCodePro-Medium", Monaco, monospace;
  }
  </style>