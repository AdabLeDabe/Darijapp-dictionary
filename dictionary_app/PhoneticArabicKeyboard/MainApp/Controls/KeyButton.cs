using MainApp.Helper;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Windows;
using System.Windows.Controls;

namespace MainApp.Controls
{
    public class KeyButton : Button
    {
        public static readonly DependencyProperty KeyCharProperty =
            DependencyProperty.Register(
                "KeyChar",
                typeof(char),
                typeof(KeyButton),
                new PropertyMetadata(default(char), OnKeyCharChanged));

        public static readonly DependencyProperty ArabicCharProperty =
            DependencyProperty.Register(
                "ArabicChar",
                typeof(char),
                typeof(KeyButton),
                new PropertyMetadata(default(char), OnArabicCharChanged));

        public char KeyChar
        {
            get => (char)GetValue(KeyCharProperty);
            set => SetValue(KeyCharProperty, value);
        }

        public char ArabicChar
        {
            get => (char)GetValue(ArabicCharProperty);
            set => SetValue(ArabicCharProperty, value);
        }

        private static void OnKeyCharChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is KeyButton keyButton)
            {
                UpdateKeyButtonDisplay(keyButton);
            }
        }

        private static void OnArabicCharChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is KeyButton keyButton)
            {
                UpdateKeyButtonDisplay(keyButton);
            }
        }

        private static void UpdateKeyButtonDisplay(KeyButton keyButton)
        {
            if (keyButton.ArabicChar == 0)
            {
                keyButton.Content = keyButton.KeyChar.ToString();
            }
            else
            {
                keyButton.Content = keyButton.KeyChar.ToString() + Environment.NewLine + keyButton.ArabicChar.ToString();
            }
        }

        protected override void OnClick()
        {
            base.OnClick();
            InputSender.SendChar(KeyChar);
        }
    }
}
