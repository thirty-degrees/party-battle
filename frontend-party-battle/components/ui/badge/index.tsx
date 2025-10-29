// @ts-nocheck
"use client";
import { PrimitiveIcon, UIIcon } from '@gluestack-ui/core/icon/creator';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import {
    tva,
    useStyleContext,
    withStyleContext,
} from '@gluestack-ui/utils/nativewind-utils';
import { cssInterop } from "nativewind";
import React from "react";
import { Text, View } from "react-native";

import { Svg } from "react-native-svg";
const SCOPE = "BADGE";

const badgeStyle = tva({
  base: "flex-row items-center rounded-sm data-[disabled=true]:opacity-50 px-2 py-1",
  variants: {
    action: {
      error: "bg-background-error dark:bg-error-950 border-error-300 dark:border-error-700",
      warning: "bg-background-warning dark:bg-warning-950 border-warning-300 dark:border-warning-700",
      success: "bg-background-success dark:bg-success-950 border-success-300 dark:border-success-700",
      info: "bg-background-info dark:bg-info-950 border-info-300 dark:border-info-700",
      muted: "bg-background-muted dark:bg-background-900 border-background-300 dark:border-background-700",
    },
    variant: {
      solid: "",
      outline: "border",
    },
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
});

const badgeTextStyle = tva({
  base: "text-typography-700 dark:text-typography-300 font-body font-normal tracking-normal uppercase",

  parentVariants: {
    action: {
      error: "text-error-600 dark:text-error-400",
      warning: "text-warning-600 dark:text-warning-400",
      success: "text-success-600 dark:text-success-400",
      info: "text-info-600 dark:text-info-400",
      muted: "text-background-800 dark:text-background-200",
    },
    size: {
      sm: "text-2xs",
      md: "text-xs",
      lg: "text-sm",
    },
  },
  variants: {
    isTruncated: {
      true: "web:truncate",
    },
    bold: {
      true: "font-normal",
    },
    underline: {
      true: "underline",
    },
    strikeThrough: {
      true: "line-through",
    },
    sub: {
      true: "text-xs",
    },
    italic: {
      true: "italic",
    },
    highlight: {
      true: "bg-yellow-500 dark:bg-yellow-500",
    },
  },
});

const badgeIconStyle = tva({
  base: "fill-none",
  parentVariants: {
    action: {
      error: "text-error-600 dark:text-error-400",
      warning: "text-warning-600 dark:text-warning-400",
      success: "text-success-600 dark:text-success-400",
      info: "text-info-600 dark:text-info-400",
      muted: "text-background-800 dark:text-background-200",
    },
    size: {
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
      lg: "h-4 w-4",
    },
  },
});

const ContextView = withStyleContext(View, SCOPE);

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

type IBadgeProps = React.ComponentPropsWithoutRef<typeof ContextView> &
  VariantProps<typeof badgeStyle>;
function Badge({
  children,
  action = "muted",
  variant = "solid",
  size = "md",
  className,
  ...props
}: { className?: string } & IBadgeProps) {
  return (
    <ContextView
      className={badgeStyle({ action, variant, class: className })}
      {...props}
      context={{
        action,
        variant,
        size,
      }}
    >
      {children}
    </ContextView>
  );
}

type IBadgeTextProps = React.ComponentPropsWithoutRef<typeof Text> &
  VariantProps<typeof badgeTextStyle>;

const BadgeText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  IBadgeTextProps
>(function BadgeText({ children, className, size, ...props }, ref) {
  const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);
  return (
    <Text
      ref={ref}
      className={badgeTextStyle({
        parentVariants: {
          size: parentSize,
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
    >
      {children}
    </Text>
  );
});

type IBadgeIconProps = React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
  VariantProps<typeof badgeIconStyle>;

const BadgeIcon = React.forwardRef<
  React.ComponentRef<typeof Svg>,
  IBadgeIconProps
>(function BadgeIcon({ className, size, ...props }, ref) {
  const { size: parentSize, action: parentAction } = useStyleContext(SCOPE);

  if (typeof size === "number") {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    (props?.height !== undefined || props?.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIIcon
        ref={ref}
        {...props}
        className={badgeIconStyle({ class: className })}
      />
    );
  }
  return (
    <UIIcon
      className={badgeIconStyle({
        parentVariants: {
          size: parentSize,
          action: parentAction,
        },
        size,
        class: className,
      })}
      {...props}
      ref={ref}
    />
  );
});

Badge.displayName = "Badge";
BadgeText.displayName = "BadgeText";
BadgeIcon.displayName = "BadgeIcon";

export { Badge, BadgeIcon, BadgeText };
