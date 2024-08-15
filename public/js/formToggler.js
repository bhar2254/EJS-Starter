const toggleForm = () => {
    $(document).ready(function() {
        $('.editable-toggler').toggle()
        $('span.editable').each(function() {
            // Get the id of the current span
            var spanId = $(this).attr('id');
            var spanClass = $(this).attr('class');
            // Get the current text inside the span
            var spanText = $(this).text();
            // Create a new input element
            var input = $('<input>', {
                type: 'text',
                name: spanId,
                value: spanText,
                class: spanClass
            });
            input.addClass('form-control bg-glass-secondary-3')
            // Replace the span with the input
            $(this).replaceWith(input);
        });
    });
}

const cancelForm = () => {
    $(document).ready(function() {
        $('.editable-toggler').toggle()
        $('input.editable').each(function() {
            // Get the id of the current span
            var inputId = $(this).attr('name');
            var inputClass = $(this).attr('class');
            // Get the current text inside the span
            var inputText = $(this).val();
            // Create a new input element
            var span = $('<span>', {
                id: inputId,
                text: inputText,
                class: inputClass
            });
            span.removeClass('form-control bg-glass-secondary-3')
            // Replace the span with the input
            $(this).replaceWith(span);
        });
    });
}
