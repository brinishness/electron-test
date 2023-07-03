import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from "path";
import postCssPxToVw from "postcss-px-to-viewport";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(),
        // ...
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    base: './',
    // css: {
    //     postcss: {
    //         plugins: [
    //             postCssPxToVw({
    //                 unitToConvert: 'px', // 要转化的单位
    //                 viewportWidth: 2560, // UI设计稿的宽度，一般写 320
    //
    //                 // 下面的不常用，上面的常用
    //                 unitPrecision: 6, // 转换后的精度，即小数点位数
    //                 propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    //                 viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
    //                 fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
    //                 selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
    //                 minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
    //                 mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
    //                 replace: true, // 是否转换后直接更换属性值
    //                 landscape: false // 是否处理横屏情况
    //             })
    //         ]
    //     }
    // },
    resolve: {
        alias: {
            // '@': fileURLToPath(new URL('./src', import.meta.url))
            '@': path.resolve(__dirname, 'src'),
        }
    },
    server: {
        host: "0.0.0.0",
        port: 5175
    },
    build: {
        chunkSizeWarningLimit: 5000,
        rollupOptions: {
            output: {
                chunkFileNames: 'static/[name].js',
                entryFileNames: 'static/js/[name].js',
                assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
            },
        },
    }
})
