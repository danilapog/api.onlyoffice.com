import { vanillaRenderers } from '@jsonforms/vanilla-renderers'

import { TextControl, textControlTester } from './controls/TextControl'
import { BooleanControl, booleanControlTester } from './controls/BooleanControl'
import { EnumControl, enumControlTester } from './controls/EnumControl'
import { HiddenControl, hiddenControlTester } from './controls/HiddenControl'
import { ObjectLayout, objectLayoutTester } from './layouts/ObjectLayout'
import { ArrayControl, arrayControlTester } from './arrays/ArrayControl'
import { OneOfControl, oneOfControlTester } from './arrays/OneOfControl'

export const renderers = [
    { tester: hiddenControlTester, renderer: HiddenControl },
    { tester: oneOfControlTester, renderer: OneOfControl },
    { tester: objectLayoutTester, renderer: ObjectLayout },
    { tester: arrayControlTester, renderer: ArrayControl },
    { tester: enumControlTester, renderer: EnumControl },
    { tester: booleanControlTester, renderer: BooleanControl },
    { tester: textControlTester, renderer: TextControl },
    ...vanillaRenderers,
]

