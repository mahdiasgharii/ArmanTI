/**
 * Formik field adapters for shadcn components.
 * Replaces formik-mui / formik-mui-lab bindings.
 *
 * Usage:
 *   import { formikToInput } from '../../lib/formik-shadcn-adapters';
 *   <Field name="title" component={formikToInput} />
 */

import * as React from 'react';
import { useField, useFormikContext } from 'formik';
import { Input, type InputProps } from '../components/ui/input';
import { Textarea, type TextareaProps } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { cn } from './utils';

// ── fieldToInput ─────────────────────────────────────────────────
export function fieldToInput({
  name,
  ...props
}: { name: string } & InputProps): React.ReactElement {
  const [field, meta] = useField(name);
  const showError = meta.touched && Boolean(meta.error);
  return (
    <Input
      {...field}
      {...props}
      className={cn(props.className, showError && 'border-danger focus-visible:ring-danger')}
    />
  );
}

// ── fieldToTextarea ──────────────────────────────────────────────
export function fieldToTextarea({
  name,
  ...props
}: { name: string } & TextareaProps): React.ReactElement {
  const [field, meta] = useField(name);
  const showError = meta.touched && Boolean(meta.error);
  return (
    <Textarea
      {...field}
      {...props}
      className={cn(props.className, showError && 'border-danger focus-visible:ring-danger')}
    />
  );
}

// ── fieldToCheckbox ──────────────────────────────────────────────
export function fieldToCheckbox({
  name,
  ...props
}: { name: string } & Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'checked' | 'onCheckedChange'>): React.ReactElement {
  const [field, , helpers] = useField({ name, type: 'checkbox' });
  return (
    <Checkbox
      checked={field.value === true}
      onCheckedChange={(checked) => helpers.setValue(checked === true)}
      {...props}
    />
  );
}

// ── fieldToSwitch ────────────────────────────────────────────────
export function fieldToSwitch({
  name,
  ...props
}: { name: string } & Omit<React.ComponentPropsWithoutRef<typeof Switch>, 'checked' | 'onCheckedChange'>): React.ReactElement {
  const [field, , helpers] = useField({ name, type: 'checkbox' });
  return (
    <Switch
      checked={field.value === true}
      onCheckedChange={(checked) => helpers.setValue(checked === true)}
      {...props}
    />
  );
}

// ── fieldToSelect (shadcn Radix Select) ──────────────────────────
export function fieldToSelect(
  name: string,
): {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
} {
  const [field, , helpers] = useField(name);
  return {
    value: field.value ?? '',
    onValueChange: (value: string) => helpers.setValue(value),
    name,
  };
}

// ── useFieldError helper ─────────────────────────────────────────
export function useFieldError(name: string): { error?: string; touched: boolean } {
  const [, meta] = useField(name);
  return {
    error: meta.touched ? meta.error : undefined,
    touched: meta.touched,
  };
}

// ── useFieldStatus helper ────────────────────────────────────────
export function useFieldStatus(name: string): { showError: boolean; error?: string } {
  const [, meta] = useField(name);
  const showError = meta.touched && Boolean(meta.error);
  return {
    showError,
    error: showError ? meta.error : undefined,
  };
}
