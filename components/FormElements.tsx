import React from 'react'
import { TextFieldFormElement } from './fields/TextField'
import { TitleFieldFormElement } from './fields/TitleField'
import { SubTitleFieldFormElement } from './fields/SubTitleField'

export type ElementsType = 'TextField' | 'TitleField' | 'SubTitleField'

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
  SubTitleField: SubTitleFieldFormElement
}
