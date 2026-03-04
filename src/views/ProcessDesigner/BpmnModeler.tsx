import { defineComponent, onMounted, type PropType, ref } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import GridLineModule from 'diagram-js-grid-bg'
// import GridModule from 'diagram-js-grid'
import MinimapModule from 'diagram-js-minimap'
import LintModule from 'bpmn-js-bpmnlint'
import TokenSimulationModule from 'bpmn-js-token-simulation'
import Translate from './Translate'
import httpTaskRenderer from './Renderer/index.ts'
import CustomModeling from './Modeling/index.ts'
import flowableModdleDescriptors from './flowable.json'
import CustomContextPad from './ContextPad'
import CustomPopupMenu from './PopupMenu'
import CustomReplace from './Replace'
import ElementParse from './Parse'
// import ConnectorTemplate from './Connector'
import RerenderPalette from '@/views/ProcessDesigner/Palette'
import BpmnColorPickerModule from 'bpmn-js-color-picker'
// import { CreateAppendAnythingModule } from 'bpmn-js-create-append-anything'
import bpmnlint from './Lint'

export default defineComponent({
  props: {
    options: {
      type: Object as PropType<Record<string, any>>,
      default: () => {},
    },
  },
  emits: ['modeler-ready'],
  setup(props, { emit }) {
    const canvasRef = ref<HTMLDivElement>()
    const modeler = ref<BpmnModeler>()
    onMounted(async () => {
      modeler.value = new BpmnModeler({
        container: canvasRef.value,
        height: '100%',
        width: '100%',
        additionalModules: [
          GridLineModule,
          // GridModule,
          CustomModeling,
          MinimapModule,
          Translate,
          LintModule,
          TokenSimulationModule,
          httpTaskRenderer,
          CustomContextPad,
          CustomPopupMenu,
          CustomReplace,
          ElementParse,
          // ConnectorTemplate,
          RerenderPalette,
          BpmnColorPickerModule,
        ],
        moddleExtensions: {
          flowable: flowableModdleDescriptors,
        },
        connectorIconRenderer: {
          iconProperty: 'flowable:connectorIcon',
        },
        gridLine: {
          smallGridSpacing: 10,
          gridSpacing: 100,
          gridLineStroke: 1,
          gridLineOpacity: 0.1,
          gridLineColor: 'var(--el-border-color)',
        },
        bpmnRenderer: {
          defaultFillColor: 'var(--bjsl-fill-color)',
          defaultStrokeColor: 'var(--bjsl-stroke-color)',
          // defaultLabelColor: 'var(--el-text-color-primary)'
        },
        linting: {
          active: true,
          bpmnlint: bpmnlint,
        },
        minimap: {
          open: true,
        },
        ...props.options,
      })
      /*const linting = modeler.value.get<any>('linting');
      linting.toggle(true);
      console.log(linting.isActive())
      console.log(linting.getLinterConfig())*/
      emit('modeler-ready', modeler.value)
    })
    return () => <div class="canvas" ref={canvasRef} />
  },
})
