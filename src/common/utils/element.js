import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'

import { Input, Button, Badge, Card, Collapse, CollapseItem,
      Dialog, Message, MessageBox, Image, Timeline, TimelineItem,
      Pagination, Drawer, Carousel, CarouselItem, Upload, Table,
      TableColumn, Tag, Backtop, Link, Menu, MenuItem, Form, FormItem,
      Tooltip, Popover, Calendar, Radio, Notification} from 'element-ui'

Vue.use(Input)
Vue.use(Button)
Vue.use(Badge)
Vue.use(Card)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Dialog)
Vue.use(Image)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Pagination)
Vue.use(Drawer)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Upload)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Backtop)
Vue.use(Link)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Calendar)
Vue.use(Radio)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
