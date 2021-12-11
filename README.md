# Проблемы
## Dry-stack
# Controllers
- Если сделать `require 'dry/system/container'` - куча депрекейтедов в dry-configurable внутри гема
- Проблемы с конфигурацией при настройке контроллера - undefined method `component_dirs' for #<Dry::Configurable::Config:0x00007f949b1cfde0>
- Вывод - пока `Dry::Container::Mixin`

# Замечания
- В нормальных условиях простейшая валидация была бы на фронте средства html - можно, например, указать тип email - и
браузер сам проверит на похожесть на 
