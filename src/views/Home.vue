<template>
    <div class="flex flex-col items-center bg-[#ECF1FF] h-full p-10">
        <!-- Text Area component with clear functionality -->
        <InputTextArea v-model="textAreaInput">
            <template #label>
                <label class="text-gray-600 font-bold text-xs text-left">Write your text ... </label>
            </template>
            <template #actions="{ clear }">
                <button
                    @click="clear"
                    class="text-sm self-end bg-[#FFCC03] hover:bg-[#F9D64D] hover:shadow-lg text-gray-800 font-bold py-2 px-6 rounded-full"
                >
                    Clear
                </button>
            </template>
        </InputTextArea>
        <transition tag="div" name="fade">
            <div
                v-if="listWords.value?.length"
                class="
                    bg-[#DBA61F]
                    w-[20rem]
                    break-words
                    list-disc list-outside
                    mt-10
                    border
                    rounded-lg
                    max-h-[30rem]
                    overflow-y-auto
                    min-h-[16rem]
                "
            >
                <!-- Fixed header (it should be a Table component with all the functionality inside (Order, dragAndDrop ... ))-->
                <div class="text-xl font-bold grid grid-cols-2 p-2 sticky top-0 bg-[#8F6600]">
                    <div
                        @click="sortBy('word')"
                        class="
                            flex
                            items-center
                            space-x-2
                            hover:shadow-lg
                            rounded-lg
                            p-2
                            cursor-pointer
                            transition
                            ease-in-out
                            duration-500
                        "
                    >
                        <span>words</span>
                        <component
                            v-if="orderDirection && orderBy === 'word'"
                            class="w-3 h-3"
                            :is="orderDirection === 'desc' ? 'ArrowDownIcon' : 'ArrowUpIcon'"
                        />
                    </div>
                    <span
                        @click="sortBy('count')"
                        class="
                            flex
                            items-center
                            space-x-2
                            hover:shadow-lg
                            rounded-lg
                            p-2
                            cursor-pointer
                            transition
                            ease-in-out
                            duration-500
                            justify-center
                        "
                    >
                        <span>counter</span>
                        <component
                            v-if="orderDirection && orderBy === 'count'"
                            class="w-3 h-3"
                            :is="orderDirection === 'desc' ? 'ArrowDownIcon' : 'ArrowUpIcon'"
                        />
                    </span>
                </div>
                <!-- List of words -->
                <transition-group tag="div" name="list">
                    <div v-for="(wordCounter, index) in listWords.value" :key="index" class="flex items-center grid grid-cols-2 p-2">
                        <span>{{ wordCounter.word }}</span>
                        <span class="text-center">{{ wordCounter.count }}</span>
                    </div>
                </transition-group>
            </div>
        </transition>
    </div>
</template>
<script>
    import { ref, reactive, watch } from 'vue';
    import InputTextArea from '@/components/InputTextArea.vue';
    import { orderDirectionFunction, sortTable } from '@/utils/Utils.js';
    import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/vue/outline';

    export default {
        components: { InputTextArea, ArrowDownIcon, ArrowUpIcon },
        setup() {
            //Data reactive
            const textAreaInput = ref('');
            const listWords = reactive({});
            //Order list
            const orderBy = ref('');
            const orderDirection = ref('');

            //Dynamic oderTable
            const sortBy = key => {
                orderDirection.value = orderDirectionFunction(orderDirection.value);
                orderBy.value = key;
                listWords.value = sortTable(listWords.value, key, orderDirection.value);
            };

            const addObjectOccurrenceToList = list => {
                for (const word of list) {
                    //Check if the Object exist in the list
                    const objIndex = listWords.value.findIndex(item => item.word === word);
                    //If not exist add
                    if (objIndex === -1) {
                        const occurrence = {};
                        occurrence.word = word;
                        occurrence.count = 1;
                        listWords.value.push(occurrence);
                        continue;
                    }
                    //Else sum count +1
                    listWords.value[objIndex].count++;
                }
                //Read the sortTable config to apply to the news words
                listWords.value = sortTable(listWords.value, orderBy.value, orderDirection.value);
            };

            //Watch textAreaInput Value change
            watch(
                () => textAreaInput.value,
                newValue => {
                    listWords.value = [];
                    //Split ignoring upperCase and removing empty spaces
                    const words = newValue
                        .toLowerCase()
                        .replace(/(\r\n|\n|\r)/gm, ' ')
                        .split(' ')
                        .filter(item => item.trim() !== '');

                    addObjectOccurrenceToList(words);
                },
            );

            return {
                textAreaInput,
                listWords,
                sortBy,
                orderBy,
                orderDirection,
            };
        },
    };
</script>
<style>
    .list-enter-active,
    .list-leave-active,
    .list-move {
        transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
        transition-property: opacity, transform;
    }

    .list-enter {
        opacity: 0;
        transform: translateX(50px) scaleY(0.5);
    }

    .list-enter-to {
        opacity: 1;
        transform: translateX(0) scaleY(1);
    }

    .list-leave-active {
        position: absolute;
    }

    .list-leave-to {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: center top;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>