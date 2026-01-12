using MainApp.Helper;
using System;
using System.Collections.Generic;
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

        public char KeyChar
        {
            get => (char)GetValue(KeyCharProperty);
            set => SetValue(KeyCharProperty, value);
        }

        private static void OnKeyCharChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            if (d is KeyButton keyButton)
            {
                keyButton.Content = keyButton.KeyChar.ToString();
            }
        }

        protected override void OnClick()
        {
            base.OnClick();
            InputSender.SendChar(KeyChar);
        }
    }
}
