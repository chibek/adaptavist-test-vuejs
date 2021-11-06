<template>
    <div class="flex flex-col space-y-2">
        <slot name="label"></slot>
        <textarea
            v-model="textAreaInput"
            @input="$emit('update:modelValue', $event.target.value)"
            :class="classInputArea"
            placeholder="New sentence"
        />
        <slot name="actions" :clear="clear"></slot>
    </div>
</template>

<script>
    import { ref } from 'vue';

    export default {
        name: 'InputTextArea',
        props: {
            classInputArea: {
                type: String,
                default: 'text-xs font-bold h-20 w-[20rem] form-textarea ring border-none rounded-lg shadow-lg',
            },
        },
        setup(props, { emit }) {
            const textAreaInput = ref('');
            const clear = () => {
                textAreaInput.value = '';
                emit('update:modelValue', textAreaInput.value);
            };

            return {
                textAreaInput,
                clear,
            };
        },
    };
</script>
