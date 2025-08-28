"use client";
import React from "react";
import { createButton } from '@gluestack-ui/core/button/creator';
import { tva } from '@gluestack-ui/utils/nativewind-utils';
import {
  withStyleContext,
  useStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from "nativewind";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';

const SCOPE = "BUTTON";

const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
  Root: Root,
  Text,
  Group: View,
  Spinner: ActivityIndicator,
  Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

const buttonStyle = tva({
  base: "group/button rounded bg-primary-500 dark:bg-primary-500 flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2",
  variants: {
    action: {
      primary:
        "bg-primary-500 dark:bg-primary-500 data-[hover=true]:bg-primary-600 dark:data-[hover=true]:bg-primary-400 data-[active=true]:bg-primary-700 dark:data-[active=true]:bg-primary-300 border-primary-300 dark:border-primary-700 data-[hover=true]:border-primary-400 dark:data-[hover=true]:border-primary-600 data-[active=true]:border-primary-500 dark:data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-indicator-info",
      secondary:
        "bg-tertiary-100 dark:bg-tertiary-800 border-tertiary-200 dark:border-tertiary-700 data-[hover=true]:bg-tertiary-200 dark:data-[hover=true]:bg-tertiary-700 data-[hover=true]:border-tertiary-300 dark:data-[hover=true]:border-tertiary-600 data-[active=true]:bg-tertiary-300 dark:data-[active=true]:bg-tertiary-600 data-[active=true]:border-tertiary-400 dark:data-[active=true]:border-tertiary-500 data-[focus-visible=true]:web:ring-indicator-info",
      positive:
        "bg-success-500 dark:bg-success-500 border-success-300 dark:border-success-700 data-[hover=true]:bg-success-600 dark:data-[hover=true]:bg-success-400 data-[hover=true]:border-success-400 dark:data-[hover=true]:border-success-600 data-[active=true]:bg-success-700 dark:data-[active=true]:bg-success-300 data-[active=true]:border-success-500 dark:data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info",
      negative:
        "bg-error-500 dark:bg-error-500 border-error-300 dark:border-error-700 data-[hover=true]:bg-error-600 dark:data-[hover=true]:bg-error-400 data-[hover=true]:border-error-400 dark:data-[hover=true]:border-error-600 data-[active=true]:bg-error-700 dark:data-[active=true]:bg-error-300 data-[active=true]:border-error-500 dark:data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info",
      default:
        "bg-transparent dark:bg-transparent data-[hover=true]:bg-background-50 dark:data-[hover=true]:bg-background-900 data-[active=true]:bg-transparent dark:data-[active=true]:bg-transparent",
    },
    variant: {
      link: "px-0",
      outline:
        "bg-transparent dark:bg-transparent border dark:border-background-700 data-[hover=true]:bg-background-50 dark:data-[hover=true]:bg-background-900 data-[active=true]:bg-transparent dark:data-[active=true]:bg-transparent",
      solid: "",
    },

    size: {
      xs: "px-3.5 h-8",
      sm: "px-4 h-9",
      md: "px-5 h-10",
      lg: "px-6 h-11",
      xl: "px-7 h-12",
    },
  },
  compoundVariants: [
    {
      action: "primary",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "secondary",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "positive",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "negative",
      variant: "link",
      class:
        "px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent",
    },
    {
      action: "primary",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "secondary",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "positive",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
    {
      action: "negative",
      variant: "outline",
      class:
        "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
    },
  ],
});

const buttonTextStyle = tva({
  base: "text-typography-0 dark:text-typography-0 font-semibold web:select-none",
  parentVariants: {
    action: {
      primary:
        "text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700",
      secondary:
        "text-tertiary-700 dark:text-tertiary-200 data-[hover=true]:text-tertiary-800 dark:data-[hover=true]:text-tertiary-100 data-[active=true]:text-tertiary-900 dark:data-[active=true]:text-tertiary-50",
      positive:
        "text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700",
      negative:
        "text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700",
    },
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline",
      outline: "",
      solid:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-typography-800 dark:text-typography-0 data-[hover=true]:text-typography-800 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-800 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "outline",
      action: "primary",
      class:
        "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
    },
    {
      variant: "outline",
      action: "secondary",
      class:
        "text-typography-500 data-[hover=true]:text-primary-600 data-[active=true]:text-typography-700",
    },
    {
      variant: "outline",
      action: "positive",
      class:
        "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
    },
    {
      variant: "outline",
      action: "negative",
      class:
        "text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500",
    },
  ],
});

const buttonIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    variant: {
      link: "data-[hover=true]:underline data-[active=true]:underline",
      outline: "",
      solid:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    size: {
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-[18px] w-[18px]",
      xl: "h-5 w-5",
    },
    action: {
      primary:
        "text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700",
      secondary:
        "text-tertiary-700 dark:text-tertiary-200 data-[hover=true]:text-tertiary-800 dark:data-[hover=true]:text-tertiary-100 data-[active=true]:text-tertiary-900 dark:data-[active=true]:text-tertiary-50",
      positive:
        "text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700",

      negative:
        "text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700",
    },
  },
  parentCompoundVariants: [
    {
      variant: "solid",
      action: "primary",
      class:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "solid",
      action: "secondary",
      class:
        "text-typography-800 dark:text-typography-0 data-[hover=true]:text-typography-800 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-800 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "solid",
      action: "positive",
      class:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
    {
      variant: "solid",
      action: "negative",
      class:
        "text-typography-0 dark:text-typography-0 data-[hover=true]:text-typography-0 dark:data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0 dark:data-[active=true]:text-typography-0",
    },
  ],
});

const buttonGroupStyle = tva({
  base: "",
  variants: {
    space: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5",
      "2xl": "gap-6",
      "3xl": "gap-7",
      "4xl": "gap-8",
    },
    isAttached: {
      true: "gap-0",
    },
    flexDirection: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
  },
});

type IButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof UIButton>,
  "context"
> &
  VariantProps<typeof buttonStyle> & { className?: string };

const Button = React.forwardRef<
  React.ComponentRef<typeof UIButton>,
  IButtonProps
>(function Button(
  { className, variant = "solid", size = "md", action = "primary", ...props },
  ref
) {
  return (
    <UIButton
      ref={ref}
      {...props}
      className={buttonStyle({ variant, size, action, class: className })}
      context={{ variant, size, action }}
    />
  );
});

type IButtonTextProps = React.ComponentPropsWithoutRef<typeof UIButton.Text> &
  VariantProps<typeof buttonTextStyle> & { className?: string };

const ButtonText = React.forwardRef<
  React.ComponentRef<typeof UIButton.Text>,
  IButtonTextProps
>(function ButtonText({ className, variant, size, action, ...props }, ref) {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE);

  return (
    <UIButton.Text
      ref={ref}
      {...props}
      className={buttonTextStyle({
        parentVariants: {
          variant: parentVariant,
          size: parentSize,
          action: parentAction,
        },
        variant,
        size,
        action,
        class: className,
      })}
    />
  );
});

const ButtonSpinner = UIButton.Spinner;

type IButtonIcon = React.ComponentPropsWithoutRef<typeof UIButton.Icon> &
  VariantProps<typeof buttonIconStyle> & {
    className?: string | undefined;
    as?: React.ElementType;
    height?: number;
    width?: number;
  };

const ButtonIcon = React.forwardRef<
  React.ComponentRef<typeof UIButton.Icon>,
  IButtonIcon
>(function ButtonIcon({ className, size, ...props }, ref) {
  const {
    variant: parentVariant,
    size: parentSize,
    action: parentAction,
  } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props.height !== undefined || props.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIButton.Icon
        ref={ref}
        {...props}
        className={buttonIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIButton.Icon
      {...props}
      className={buttonIconStyle({
        parentVariants: {
          size: parentSize,
          variant: parentVariant,
          action: parentAction,
        },
        size,
        class: className,
      })}
      ref={ref}
    />
  );
});

type IButtonGroupProps = React.ComponentPropsWithoutRef<typeof UIButton.Group> &
  VariantProps<typeof buttonGroupStyle>;

const ButtonGroup = React.forwardRef<
  React.ComponentRef<typeof UIButton.Group>,
  IButtonGroupProps
>(function ButtonGroup(
  {
    className,
    space = "md",
    isAttached = false,
    flexDirection = "column",
    ...props
  },
  ref
) {
  return (
    <UIButton.Group
      className={buttonGroupStyle({
        class: className,
        space,
        isAttached,
        flexDirection,
      })}
      {...props}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
ButtonText.displayName = "ButtonText";
ButtonSpinner.displayName = "ButtonSpinner";
ButtonIcon.displayName = "ButtonIcon";
ButtonGroup.displayName = "ButtonGroup";

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };
