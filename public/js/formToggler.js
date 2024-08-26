const toggleForm = () => {
    $(document).ready(function() {
        $('.editable-toggler').toggle()
        $('span.editable').each(function() {
            const attr = {
                id: $(this).attr('id'),
                class: $(this).attr('class'),
                tag: $(this).attr('data-tag') || 'input',
                type: $(this).attr('data-type') || 'text',
                text: $(this).text(),
            }
            var input = $(`<${attr.tag}>`, {
                type: 'text',
                name: attr.id,
                value: attr.text,
                val: attr.text,
                class: attr.class,
                rows: 5,
            })
            input.addClass('form-control bg-glass-secondary-3')
            $(this).replaceWith(input)
            $(this).attr('data-tag', attr.tag)
            $(this).attr('data-type', attr.type)
        });
    });
}

const cancelForm = () => {
    $(document).ready(function() {
        $('.editable-toggler').toggle()
        $('input.editable textarea.editable select.editable').each(function() {
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
