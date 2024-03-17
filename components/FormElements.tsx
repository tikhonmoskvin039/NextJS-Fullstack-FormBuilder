import React from 'react'
import { TextFieldFormElement } from './fields/TextField'
import { TitleFieldFormElement } from './fields/TitleField'
import { SubTitleFieldFormElement } from './fields/SubTitleField'
import { ParagraphFieldFormElement } from './fields/ParagraphField'
import { SeparatorFieldFormElement } from './fields/SeparatorField'
import { SpacerFieldFormElement } from './fields/SpacerField'
import { NumberFieldFormElement } from './fields/NumberField'
import { TextAreaFieldFormElement } from './fields/TextAreaField'
import { DateFieldFormElement } from './fields/DateField'
import { SelectFieldFormElement } from './fields/SelectField'
import { CheckboxFieldFormElement } from './fields/CheckboxField'

export type ElementsType =
    'TextField' |
    'TitleField' |
    'SubTitleField' |
    'ParagraphField' |
    'SeparatorField' |
    'SpacerField' |
    'TextAreaField' |
    'NumberField' |
    'SelectField' |
    'CheckboxField' |
    'DateField'

export type FormElementInstance = {
    id: string
    type: ElementsType
    extraAttributes?: Record<string, any>
}

export type SubmitFunction = (key: string, value:string) => void

export type FormElement = {
    type: ElementsType

    construct: (id: string) => FormElementInstance

    designerBtnElement: {
        icon: React.ElementType,
        label: string
    }

    designerComponent: React.FC<{
        elementInstance: FormElementInstance
    }>
    formComponent: React.FC<{
        elementInstance: FormElementInstance;
        submitValue?: SubmitFunction
        isInvalid?: boolean
        defaultValue?: string
    }>
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance
    }>
    validate: (formElement: FormElementInstance, currentValue: string) => boolean
}

type FormElementsType = {
    // eslint-disable-next-line no-unused-vars
    [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFieldFormElement,
  DateField: DateFieldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement
}
